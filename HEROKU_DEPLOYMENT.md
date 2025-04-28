# Deploying to Heroku

This guide will walk you through deploying your barber shop website to Heroku.

## Prerequisites

1. Create a [Heroku account](https://signup.heroku.com/) if you don't have one
2. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
3. Have [Git](https://git-scm.com/downloads) installed on your computer

## Deployment Steps

1. **Log in to Heroku from the command line**

```bash
heroku login
```

2. **Create a new Heroku app**

```bash
heroku create your-barber-shop-name
```

Replace `your-barber-shop-name` with a unique name for your app.

3. **Initialize a Git repository in your project folder (if not already done)**

```bash
git init
git add .
git commit -m "Initial commit"
```

4. **Add the Heroku remote**

```bash
heroku git:remote -a your-barber-shop-name
```

Replace `your-barber-shop-name` with the name you chose in step 2.

5. **Push your code to Heroku**

```bash
git push heroku main
```

If your branch is named `master` instead of `main`, use:

```bash
git push heroku master
```

6. **Open your deployed application**

```bash
heroku open
```

## Important Notes

- **Data Persistence**: Heroku has an ephemeral filesystem, which means any data stored in files will be lost whenever the app is restarted or redeployed. This application stores data in JSON files in a temporary directory that will be recreated on app restart, but the data will be reset to default values.

- For a production environment with permanent data storage, consider:
  - Using a database add-on like Heroku Postgres
  - Connecting to an external database service
  - Setting up regular backups of your data files

- **Admin Access**: The default admin credentials are:
  - Username: `deep`
  - Password: `deep8670`

## Troubleshooting

If you encounter any issues, you can view the logs with:

```bash
heroku logs --tail
```

## Additional Resources

- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Heroku DevCenter](https://devcenter.heroku.com/)