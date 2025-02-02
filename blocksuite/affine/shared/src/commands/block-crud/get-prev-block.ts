import type { BlockComponent, Command } from '@blocksuite/block-std';

import { getPrevContentBlock } from '../../utils/index.js';

function getPrevBlock(std: BlockSuite.Std, path: string) {
  const view = std.view;

  const model = std.store.getBlock(path)?.model;
  if (!model) return null;
  const prevModel = getPrevContentBlock(std.host, model);
  if (!prevModel) return null;
  return view.getBlock(prevModel.id);
}

export const getPrevBlockCommand: Command<
  {
    currentSelectionPath?: string;
    path?: string;
  },
  {
    prevBlock?: BlockComponent;
  }
> = (ctx, next) => {
  const path = ctx.path ?? ctx.currentSelectionPath;
  if (!path) {
    console.error(
      '`path` is required, you need to pass it in args or ctx before adding this command to the pipeline.'
    );
    return;
  }

  const prevBlock = getPrevBlock(ctx.std, path);

  if (prevBlock) {
    next({ prevBlock });
  }
};
