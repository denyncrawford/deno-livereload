import Livereload from '../../src/mod.ts'

const reload = new Livereload({
  base: '.'
});

reload.watch()