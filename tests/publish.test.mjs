import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,copyFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';

async function fixture() {
  const root=await mkdtemp(join(tmpdir(),'profile-publisher-'));
  const remote=join(root,'remote.git'),repo=join(root,'profile');
  const git=(...args)=>execFileSync('git',args,{cwd:repo,encoding:'utf8',stdio:['ignore','pipe','pipe']});
  execFileSync('git',['init','--bare','--initial-branch=main',remote],{stdio:'ignore'});
  await mkdir(repo); git('init','-b','main');
  git('config','user.name','Publisher fixture'); git('config','user.email','fixture@example.invalid');
  for(const dir of ['scripts','assets','data'])await mkdir(join(repo,dir));
  await copyFile(new URL('../scripts/publish-profile.mjs',import.meta.url),join(repo,'scripts/publish-profile.mjs'));
  await writeFile(join(repo,'scripts/update-profile.mjs'),`import{writeFileSync}from'node:fs';
if(process.argv[2]==='--pin-readme')writeFileSync('README.md','refreshed\\n<img src="https://raw.githubusercontent.com/PuebloAguilar/PuebloAguilar/'+process.argv[3]+'/assets/profile-symbol-dark.svg">');
else{if(!process.argv.includes('--no-readme'))writeFileSync('README.md','refreshed');writeFileSync('data/usage.json','{}');writeFileSync('assets/profile-symbol-dark.svg','new symbol');}`);
  await writeFile(join(repo,'README.md'),'original'); await writeFile(join(repo,'data/usage.json'),'{}');
  for(const name of ['dark','light','dark-mobile','light-mobile','symbol-dark','symbol-light','metrics-dark','metrics-light','metrics-dark-mobile','metrics-light-mobile'])await writeFile(join(repo,`assets/profile-${name}.svg`),'<svg/>');
  git('add','.');git('commit','-m','fixture');git('remote','add','origin',remote);git('push','-u','origin','main');
  return {root,repo,remote,git,run:(extraEnv={})=>spawnSync(process.execPath,['scripts/publish-profile.mjs'],{cwd:repo,encoding:'utf8',env:{...process.env,...extraEnv}})};
}

test('local publisher pushes the generated panel without untracked private files',async()=>{
  const f=await fixture();
  try {
    await writeFile(join(f.repo,'private-draft.txt'),'untracked work');
    const result=f.run(); assert.equal(result.status,0,result.stderr);
    assert.ok(execFileSync('git',['--git-dir',f.remote,'show','main:README.md'],{encoding:'utf8'}).startsWith('refreshed'));
    assert.equal(execFileSync('git',['--git-dir',f.remote,'show','main:assets/profile-symbol-dark.svg'],{encoding:'utf8'}),'new symbol');
    const paths=execFileSync('git',['--git-dir',f.remote,'ls-tree','--name-only','-r','main'],{encoding:'utf8'});
    assert(!paths.includes('private-draft.txt'));
  }finally{await rm(f.root,{recursive:true,force:true});}
});

test('published README pins committed images and unchanged refreshes do not create new commits',async()=>{
  const f=await fixture();
  try {
    const first=f.run();assert.equal(first.status,0,first.stderr);
    const readme=execFileSync('git',['--git-dir',f.remote,'show','main:README.md'],{encoding:'utf8'});
    const reference=readme.match(/raw\.githubusercontent\.com\/PuebloAguilar\/PuebloAguilar\/([a-f0-9]{40})\/assets\/profile-symbol-dark\.svg/);
    assert.ok(reference,'README must reference an immutable asset commit');
    assert.equal(execFileSync('git',['--git-dir',f.remote,'show',`${reference[1]}:assets/profile-symbol-dark.svg`],{encoding:'utf8'}),'new symbol');
    const before=f.git('rev-parse','HEAD');
    const second=f.run();assert.equal(second.status,0,second.stderr);
    assert.equal(f.git('rev-parse','HEAD'),before,'An unchanged source must not keep repinning the README');
  }finally{await rm(f.root,{recursive:true,force:true});}
});

test('local publisher refuses to overwrite existing tracked work',async()=>{
  const f=await fixture();
  try {
    await writeFile(join(f.repo,'README.md'),'user work');
    const before=f.git('rev-parse','HEAD');
    const result=f.run(); assert.notEqual(result.status,0);
    assert.equal(await readFile(join(f.repo,'README.md'),'utf8'),'user work');
    assert.equal(f.git('rev-parse','HEAD'),before);
  }finally{await rm(f.root,{recursive:true,force:true});}
});

test('weekly shared publication fails visibly when another publisher holds the lock',async()=>{
  const f=await fixture();
  try {
    await writeFile(join(f.repo,'.git/profile-publish.lock'),String(process.pid));
    const before=f.git('rev-parse','HEAD');
    const result=f.run({AI_USAGE_SOURCE_FILE:join(f.root,'shared.json')});
    assert.notEqual(result.status,0,'The weekly coordinator must not mistake a skipped run for publication');
    assert.equal(f.git('rev-parse','HEAD'),before);
  }finally{await rm(f.root,{recursive:true,force:true});}
});
