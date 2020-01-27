module.exports = {
  siteMetadata: {
    title: 'Set your title here...',
    description: 'Description goes here...',
    author: 'Your name',
  },
  plugins: [
    // {
    //   resolve: 'gatsby-source-filesystem',
    //   options: {
    //     name: 'images',
    //     path: `${__dirname}/src/images`,
    //   },
    // },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-typescript',
    'gatsby-plugin-theme-ui',
  ],
}
