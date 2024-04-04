/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { setup } from 'xstate';
import { getSize } from '~shared/image';

// const machine = setup({
//   types: {} as {
//     context: {
//       file: File | null;
//       size: [width: number | undefined, height: number | undefined];
//       url: string | null;
//     };
//     events:
//       | { type: 'DROP'; file: File }
//       | { type: 'DROP.ENTER' }
//       | { type: 'DROP.EXIT' }
//       | { type: 'RESET' }
//       | { type: 'HOVER' }
//       | { type: 'UNHOVER' }
//       | { type: 'FOCUS' }
//       | { type: 'BLUR' };
//   },
//   actions: {
//     setFile: assign((context, event) => {
//       if (event.type === 'DROP') {
//         return {
//           file: event.file,
//           size: [event.file.width, event.file.height],
//           url: URL.createObjectURL(event.file),
//         };
//       }
//       return context;
//     }),
//     resetFile: assign((context) => ({
//       file: null,
//       size: [undefined, undefined],
//       url: null,
//     })),
//   },
// }).createMachine({
//   id: 'backgroundRemoval',
//   initial: 'idle',
//   context: { file: null, size: [undefined, undefined], url: null },
//   states: {
//     idle: {
//       on: {
//         DROP: {
//           target: 'hasFile',
//           actions: 'setFile',
//         },
//         HOVER: 'hovering',
//         FOCUS: 'focused',
//       },
//     },
//     hovering: {
//       on: {
//         UNHOVER: 'idle',
//         DROP: {
//           target: 'hasFile',
//           actions: 'setFile',
//         },
//       },
//     },
//     focused: {
//       on: {
//         BLUR: 'idle',
//         DROP: {
//           target: 'hasFile',
//           actions: 'setFile',
//         },
//       },
//     },
//     hasFile: {
//       on: {
//         RESET: {
//           target: 'idle',
//           actions: 'resetFile',
//         },
//       },
//     },
//   },
// });

export const state = setup({
  types: {} as {
    // 'hover' | 'focus' | 'blur' | 'drop' | 'reset'
    events:
      | {
          type: 'hover.enter';
        }
      | {
          type: 'hover.exit';
        }
      | {
          type: 'focus.enter';
        }
      | {
          type: 'focus.exit';
        }
      | {
          type: 'drop';
          file: File;
        }
      | {
          type: 'drop.enter';
          file: File;
        }
      | {
          type: 'drop.exit';
        }
      | {
          type: 'reset';
        }
      | {
          type: 'submit';
        };
    context: {
      file: File | null;
      size: [width: number | undefined, height: number | undefined];
      url: string | null;
    };
  },
  actions: {
    set: async (_, params: { file: File }) => ({
      file: params.file,
      size: await getSize(params.file),
      url: URL.createObjectURL(params.file),
    }),
    reset: async ({ context }) => {
      if (context.url !== null) URL.revokeObjectURL(context.url);

      return {
        file: null,
        size: [undefined, undefined],
        url: null,
      };
    },
  },
}).createMachine({
  id: 'BackgroundRemoval',
  context: { file: null, size: [undefined, undefined], url: null },
  initial: 'idle',
  states: {
    idle: {
      on: {
        'hover.enter': 'hovering',
        'focus.enter': 'focusing',
        'drop.enter': 'dropping',
      },
    },
    hovering: {
      on: {
        'hover.exit': 'idle',
        drop: {
          target: 'idle',
        },
      },
    },
    focusing: {
      on: {
        'focus.exit': 'idle',
        drop: {
          target: 'idle',
        },
      },
    },
    dropping: {
      on: {
        'drop.exit': 'idle',
      },
    },
  },
});
