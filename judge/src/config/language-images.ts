const languageImages = {
  c: 'tun-judge/gcc:7.3.0',
  'c++': 'tun-judge/gcc:7.3.0',
  java: 'tun-judge/openjdk:8-jre-alpine',
  javascript: 'tun-judge/node:14.15.1-alpine',
};

export type Language = keyof typeof languageImages;

export default languageImages;
