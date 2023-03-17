import * as tf from '@tensorflow/tfjs';

export async function trainModel(model, trainingData, labels, epochs) {
  const batchSize = 32;

  const xs = tf.tensor2d(trainingData, [trainingData.length, 64]);
  const ys = tf.tensor1d(labels);

  const history = await model.fit(xs, ys, {
    batchSize,
    epochs,
    shuffle: true,
    validationSplit: 0.2, // Use 20% of the data for validation
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch: ${epoch + 1}, Loss: ${logs.loss.toFixed(4)}, Validation Loss: ${logs.val_loss.toFixed(4)}`);
      },
    },
  });

  return history;
}
