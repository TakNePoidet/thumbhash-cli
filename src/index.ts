#!/usr/bin/env node
import { Command } from 'commander';
import consola from 'consola';
import { colors } from 'consola/utils';
import { resolve } from 'pathe';
import sharp from 'sharp';
import { rgbaToThumbHash } from 'thumbhash';

const program = new Command();

program
	.description('Generating a ThumbHash hash')
	.argument('<path>', 'The path to the image')
	.action(async (path) => {
		try {
			const image = sharp(resolve(path)).resize(100, 100, { fit: 'inside' });
			const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

			const binaryThumbHash = rgbaToThumbHash(info.width, info.height, data);
			const thumbHash = Buffer.from(binaryThumbHash).toString('base64');
			consola.success(colors.green(thumbHash));
		} catch (e) {
			consola.error(e instanceof Error ? e.message : e);
		}
	})
	.configureOutput({
		outputError: (str) => consola.error(str)
	});
program.parse();
