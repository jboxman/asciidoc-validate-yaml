const fsPath = require('path');

function walkTopics(node, path = '') {
  const { Dir: dir, Topics: topics } = node;
  if(!path) path = dir;
  const accum = [];

  const createObj = ({ title, path }) => ({
    title,
    path
  });

  for(const topic of topics) {
    if(topic.hasOwnProperty('Topics')) {
      accum.push(...walkTopics(topic, fsPath.join(path, topic['Dir'])));
    }
    else {
      accum.push(createObj({
        title: topic['Name'],
        path: fsPath.join(path, topic['File'])
      }));
    }
  }

  return accum;
}

module.exports = {
  walkTopics
};
