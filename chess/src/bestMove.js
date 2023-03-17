import * as tf from '@tensorflow/tfjs';

export async function predictMove(model, boardState) {
  const prediction = model.predict(tf.tensor(boardState, [1, 64]));
  const aiMove = prediction.argMax(1).dataSync()[0];

  const startRow = Math.floor(aiMove / 8);
  const startCol = aiMove % 8;

  const endRow = Math.floor(aiMove / 8);
  const endCol = aiMove % 8;

  return {
    startRow,
    startCol,
    endRow,
    endCol,
  };
}
