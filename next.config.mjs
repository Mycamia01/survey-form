import withTM from 'next-transpile-modules';

const withTMConfig = withTM(['sib-api-v3-sdk']);

const nextConfig = {
  reactStrictMode: true,
};

export default withTMConfig(nextConfig);
