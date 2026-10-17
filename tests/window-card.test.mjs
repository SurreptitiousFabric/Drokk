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
