import {execFileSync} from 'node:child_process';
import {open,readFile,unlink} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const repository=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const environment={...process.env,GIT_TERMINAL_PROMPT:'0'};
const run=(command,args)=>execFileSync(command,args,{cwd:repository,env:environment,encoding:'utf8',timeout:120000,stdio:['ignore','pipe','pipe']});
const git=(...args)=>run('git',args).trim();
const generated=['data/usage.json',...['dark','light','dark-mobile','light-mobile','symbol-dark','symbol-light','metrics-dark','metrics-light','metrics-dark-mobile','metrics-light-mobile'].map(theme=>`assets/profile-${theme}.svg`)];
const lockPath=resolve(repository,git('rev-parse','--git-path','profile-publish.lock'));

async function acquire() {
  try {return await open(lockPath,'wx');}
  catch(error){
    if(error.code!=='EEXIST')throw error;
    const pid=Number(await readFile(lockPath,'utf8'));
    if(!Number.isSafeInteger(pid)||pid<=0)throw new Error('Invalid publisher lock; inspect before retrying');
    try {process.kill(pid,0);return null;}
    catch(error){if(error.code!=='ESRCH')throw error;}
    await unlink(lockPath);
    return open(lockPath,'wx');
  }
}

const lock=await acquire();
if(!lock){console.log('Another profile publisher is running; skipping this refresh.');}
else {
  try {
    await lock.writeFile(String(process.pid));
    if(git('status','--porcelain','--untracked-files=no'))throw new Error('Tracked work is present; preserving it without refreshing');
    git('pull','--ff-only');
    console.log(run(process.execPath,['scripts/update-profile.mjs','--no-readme']).trim());
    git('add','--',...generated);
    if(git('diff','--cached','--name-only','--',...generated))git('commit','--only','-m','chore: refresh public AI usage','--',...generated);
    const assetCommit=git('log','-1','--format=%H','--',...generated);
    run(process.execPath,['scripts/update-profile.mjs','--pin-readme',assetCommit]);
    git('add','--','README.md');
    if(git('diff','--cached','--name-only','--','README.md'))git('commit','--only','-m','chore: pin profile images to collected snapshot','--','README.md');
    git('push','origin','main');
    console.log(`Public profile published at ${git('rev-parse','HEAD')}`);
  }finally{
    await lock.close();
    await unlink(lockPath);
  }
}
