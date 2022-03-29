const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInt} = require('graphql')
const app = express()


const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]


// const schema = new GraphQLSchema({
//     query: new GraphQLObjectType({
//         name: 'helloworld',
//         fields: () => ({
//             message: {type: GraphQLString,
//             resolve: ()=> 'Hello World'}
//         })
//     })
// })


const AuthorType = new GraphQLObjectType({
    name:"author",
    description:"author name",
    fields:()=>({
        id:{type: new GraphQLNonNull(GraphQLInt)},
        name:{type: new GraphQLNonNull(GraphQLString)},
        books: {
            type: new GraphQLList(BookType),
            description:"list of book for authors",
            resolve:(author)=>{
                  return books.filter(book => book.authorId === author.id)
            }
        }
    })
})
const BookType = new GraphQLObjectType({
    name:"Books",
    description:"book content",
    fields:()=>({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        authorId: {type: new GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType,
            description:"author name",
            resolve:(book)=>{
                return authors.find(author => book.authorId === author.id)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description:'query type',
    fields: () => ({
        book: {
            type: BookType,
            args: {               
                    id: {type: GraphQLInt}               
            },
            resolve:(parent, args)=>{
                return books.find(book=> book.id === args.id)
            }
        },
        books: {
            type: new GraphQLList(BookType),
            description:"list of books",
            resolve:()=> books
        },
        author: {
            type: AuthorType,
            args: {               
                    id: {type: GraphQLInt}               
            },
            resolve:(parent, args)=>{
                return authors.find(author=> author.id === args.id)
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description:"list of author",
            resolve:()=> authors
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: "mutation",
    description: "root mutation",
    fields:()=>({
        addBook:{
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                authorId:{type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve:(parrnt, args)=>{
                const book = {id: books.length+1, name:args.name, authorId:args.authorId}
                books.push(book)
                return book
            }
        },
        addAuthor:{
            type: AuthorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve:(parrnt, args)=>{
                const author = {id: authors.length+1, name:args.name}
                authors.push(author)
                return author
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})
app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))
app.listen(5000., () => console.log('Server Running'))