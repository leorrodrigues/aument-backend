<h1 align="center">Aument Post API</h1>

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/leorrodrigues/aument-backend?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/leorrodrigues/aument-backend?color=56BEB8">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/leorrodrigues/aument-backend?color=56BEB8">

</p>


<p align="center">
  <a href="#dart-about">About</a> &#xa0; | &#xa0;
  <a href="#sparkles-features">Features</a> &#xa0; | &#xa0;
  <a href="#rocket-technologies">Technologies</a> &#xa0; | &#xa0;
  <a href="#white_check_mark-requirements">Requirements</a> &#xa0; | &#xa0;
  <a href="#checkered_flag-starting">Starting</a> &#xa0; | &#xa0;
  <a href="#checkered_flag-serving-static-files">Serving static files</a> &#xa0; | &#xa0;
  <a href="https://github.com/leorrodrigues" target="_blank">Author</a>
</p>

<br>

## :dart: About ##

Back-end application built with Serverless, Node.js, and Typescript using GraphQL. Being a CRUD API application for basic POSTS that contain tags and may have a photo associated with it. Additionally, a USER login was made, allowing only authenticated users to use the CRUD functionalities.

Moreover, the application is built with Serverless, running inside AWS Lambda and its database with MongoDB in MongoDB Atlas. To run in a local environment the application runs with serverless-offline with docker container through docker-compose.

All de API documentation is under ./API_DOCS, exported by thunder client.

## :sparkles: Features ##

:heavy_check_mark: User login/logout with Bearer authentication;\
:heavy_check_mark: CRUD for TAGS;\
:heavy_check_mark: CRUD for Users;\
:heavy_check_mark: A user can only delete himself;\
:heavy_check_mark: CRUD for POSTS;\
:heavy_check_mark: One POST must have been associated with one tag;\
:heavy_check_mark: If one tag is associated with a post, this tag can't be deleted;\
:heavy_check_mark: Index page with the 3 newest recent posts;\
:heavy_check_mark: Image upload with drag-and-drop;

## :rocket: Technologies ##

The following tools were used in this project:

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [Graphql Upload](https://github.com/jaydenseric/graphql-upload)
- [TyperaphQL](https://typegraphql.com/)
- [Mongoose](https://mongoosejs.com/)

## :white_check_mark: Requirements ##

Before starting :checkered_flag:, you need to have [Backend](https://github.com/leorrodrigues/aument-backend) project running in your local machine, and have docker/docker-compose installed.

## :checkered_flag: Starting ##

```bash
# Clone this project
$ git clone https://github.com/leorrodrigues/aument-backend

# Access
$ cd aument-backend

# Install dependencies
$ yarn

# Build the project containers
$ docker-compose build

# Run the docker API with serverless-offline
$ docker-compose up api

# The server will initialize in the <http://localhost:5000>
```


## :checkered_flag: Serving static files ##

```bash
# Clone this project
$ git clone https://github.com/leorrodrigues/aument-backend

# Access
$ cd aument-backend

# Install dependencies
$ yarn

# Run serverless to serve static files
$ yarn serverless serve -f ./uploads/local -p 8080


# All static files under ./uploads/local now are available to get throught http://localhost:8080/<filename>
```

Made with :heart: by <a href="https://github.com/leorrodrigues" target="_blank">Leonardo Rodrigues</a>

&#xa0;

<a href="#top">Back to top</a>
