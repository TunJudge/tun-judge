const languageImages = {
  c: 'gcc:10.2.0',
  'c++': 'gcc:10.2.0',
  java: 'openjdk:8-jre-alpine',
  javascript: 'node:14.15.1-alpine',
};

export type Language = keyof typeof languageImages;

export default languageImages;
