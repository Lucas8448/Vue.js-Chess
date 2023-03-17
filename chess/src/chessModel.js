import * as tf from '@tensorflow/tfjs';

export function createChessModel() {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [64], units: 128, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 64, activation: 'linear' }));

  model.compile({ loss: 'meanSquaredError', optimizer: tf.train.adam(0.001) });

  return model;
}

