import { Command, FileType } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";
import logger from '~/util/log.ts';

const log = logger('default');

const transformCmd = new Command()
  .arguments('<file:string>')
  .description('Applies transforms to a epub content file')
  .option('-d, --debug', 'Enable debug features')
  .action((options, file, ...args) => {
    log.info('Running command "transform" on file:', file);
    log.inspect('With options', options);
    log.inspect('With args', args);
    return 'THIS WAS THE RESULT'
  });


const cli = new Command()
  .name("epub-mod")
  .version("0.1.0")
  .description("Does some things to epub files")
  .command('transform', transformCmd);

if (import.meta.main) {
  const { args, options, literal, cmd } =  await cli.parse(Deno.args)

  log.inspect("Finished with result:", { args, options, literal });
}
