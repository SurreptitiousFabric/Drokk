import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

test('attached card follows owner geometry and only its tab accepts clicks', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'drokk-card-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const source = `#include "CardState.hpp"
#include <cassert>
int main() {
  Drokk::CardState card;
  card.owner = {100, 200, 800, 600};
  assert(card.bounds().x == 692 && card.bounds().y == 656);
  assert(card.visible());
  assert(!card.tabContains(700, 700));
  assert(card.tabContains(903, 715));
  card.owner = {300, 100, 600, 400};
  assert(card.bounds().x == 692 && card.bounds().y == 356);
  assert(card.tabContains(903, 415));
  card.owner = {0, 0, 100, 80};
  assert(!card.visible());
  assert(!card.tabContains(0, 0));
}
`;
  fs.writeFileSync(path.join(dir, 'test.cpp'), source);
  const build = spawnSync('/usr/bin/g++', ['-std=c++23', '-Wall', '-Wextra', '-Werror',
    '-I', path.resolve('theme/mega-city-one/source/window-card'), path.join(dir, 'test.cpp'), '-o', path.join(dir, 'test')],
  { encoding: 'utf8', timeout: 10000 });
  assert.equal(build.status, 0, build.stderr);
  const result = spawnSync(path.join(dir, 'test'), [], { encoding: 'utf8', timeout: 5000 });
  assert.equal(result.status, 0, result.stderr);
});

test('card SPACE row lists other occupied workspaces once, in order, and updates from new occupancy', t => {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'drokk-card-spaces-'));
  t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  fs.writeFileSync(path.join(dir,'test.cpp'),`#include "CardState.hpp"
#include <cassert>
int main() {
  std::vector<Drokk::WorkspaceLabel> occupied={{3,"3"},{4,"4"},{1,"1"},{2,"2"},{1,"1"},{-99,"special:scratch"}};
  assert(Drokk::workspaceRow(4,"4",occupied)=="SPACE   4 (1, 2, 3)");
  assert(Drokk::workspaceRow(10,"10",{{1,"1"},{10,"10"}})=="SPACE   0 (1)");
  assert(Drokk::workspaceRow(1,"1",{{10,"10"},{2,"2"}})=="SPACE   1 (2, 0)");
  assert(Drokk::workspaceRow(10,"dev",{})=="SPACE   dev");
  assert(Drokk::workspaceRow(1,"1",{{1,"1"}})=="SPACE   1");
  assert(Drokk::workspaceRow(4,"4",{{2,"2"}})=="SPACE   4 (2)");
  assert(Drokk::workspaceRow(4,"4",{{7,"dev"},{2,"2"}})=="SPACE   4 (2, dev)");
}
`);
  const built=spawnSync('/usr/bin/g++',['-std=c++23','-Wall','-Wextra','-Werror','-I',path.resolve('theme/mega-city-one/source/window-card'),path.join(dir,'test.cpp'),'-o',path.join(dir,'test')],{encoding:'utf8',timeout:10000});
  assert.equal(built.status,0,built.stderr);
  const result=spawnSync(path.join(dir,'test'),[],{encoding:'utf8',timeout:5000});assert.equal(result.status,0,result.stderr);
});
