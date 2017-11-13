const gql = require('graphql-tag');
const { ApolloClient, createNetworkInterface } = require('apollo-client');
const { autorun, extendObservable, toJS } = require('mobx');
const graphql = require('mobx-apollo').default;

global.fetch = require('node-fetch');

const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/cj7c7kt9m08oe0198x4sk8zgy',
  dataIdFromObject: o => o.id
});
const client = new ApolloClient({
  networkInterface
});

networkInterface.use([
  {
    applyMiddleware(req, next) {
      console.log('making request');
      next();
    }
  }
]);

const allPosts = gql`
  {
    allPosts {
      id
      title
    }
  }
`;

class PostsStore {
  constructor() {
    extendObservable(this, {
      get allPosts() {
        const query = graphql({
          client,
          query: allPosts,
          fetchPolicy: 'network-only'
        });

        const posts = query.data || [];
        return posts;
      }
    });
  }
}

const postsStore = new PostsStore();
setTimeout(function() {
  autorun(() => console.log('all posts', postsStore.allPosts));
}, 2000);
