All command running in the `root` of the project.

## Project setup
- Run `npm install` command
- Run `supabase start` command (after you stop the application, you should run `supabase stop` command). When you successfully run this command in the terminal you will see the output with several variables. You have to create the `.env.local` file in the root of the project, copy `.env.example` file to this new file. Then in the terminal where you run the `supabase start` command find the `API URL`, `anon key` and the `service_role key` variables and paste their values to the proper variables in the `.env.local` file. If you wish, you can find the DB data in the `Studio URL` url.
- Run `npm run dev` command
- Run `npm run supa:reset` command. This command run DB migrations and seed the DB the predifined data (only with one admin data). All passwords for all other created users will be set to the `12345`.

## Work with the app
- Open the http://localhost:3000. To login with the predifined credentials for the admin, enter this credentials to the sign-in form:
  - email: admin@test.com
  - password: 12345
