const languageImages = {
  c: 'tunjudge/lang-cpp:7.3.0',
  'c++': 'tunjudge/lang-cpp:7.3.0',
  java: 'tunjudge/lang-java:8-jre-alpine',
  javascript: 'tunjudge/lang-node:14.15.1-alpine',
};

export type Language = keyof typeof languageImages;

export default languageImages;
