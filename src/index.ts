import { Elysia } from 'elysia';
import { memberRoute } from './members';
import { authRoute } from './auth';

const app = new Elysia().use(memberRoute).use(authRoute);

app.state('build', 1);
// app.get('/', ({ store: { build } }) => build);

app.listen(3000);
console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
