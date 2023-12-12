import esbuild from 'esbuild';
import { glob } from 'glob';

const indexFiles = await glob('src/**/index.ts');

esbuild.build({
    entryPoints: indexFiles,
    bundle: true,
    outdir: 'build/',
    outbase: 'src/',
    minify: true,
    sourcemap: true,
    platform: 'node',
    target: 'node20',
    external: ['@aws-sdk/*'],
})