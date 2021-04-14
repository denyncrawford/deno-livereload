import Dropper from 'https://deno.land/x/dropper@1.10.0/src/browser.ts'

const dropper = new Dropper('$$PROTOCOL$$://localhost:$$PORT$$' ,{
  endpoint: '/livereload',
})

dropper.on('update', () => {
  location.reload()
});