import "reflect-metadata"
import { MikroORM } from "@mikro-orm/core"
import mikroConfig from './mikro-orm.config';
import { __prod__ } from './constants';
// import { Post } from './entities/Post';
import express from 'express'
import { ApolloServer } from "apollo-server-express"
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';


const main = async () => {
	const orm = await MikroORM.init(mikroConfig);
	await orm.getMigrator().up();

	const app = express();

	const apolloSever = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver],
			validate: false
		}),
		context: () => ({ em: orm.em })
	});

	apolloSever.applyMiddleware({ app })

	app.listen(4000, () => {
		console.log('server started on http://localhost:3000')
	})
};

main().catch((err) => {
	console.error(err)
});
