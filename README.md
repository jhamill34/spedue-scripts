# 🔧 Spedue Create App 

This project has been moved to: https://gitlab.com/joshrasmussen/spedue-scripts

---

An easy way to setup and configure TypeScript projects with all the tools that don’t actually involve your application code 😅 

> “Configuration should not stand in the way of getting started”
> -  [Dan Abramov][2]

## Installation 
```bash
yarn global add @spedue/create-app
```

## Running 
```bash 
create-spedue-app my-app-name —-template=template-name
```

`create-spedue-app`  adds `@spedue/scripts`  as a devDependency and there are several templates I’ve provided but each one has some base configuration that is provided. 

### Jest Testing 
Jest is able to run out of the box and is ran by adding the line to your project `package.json`

```json
{
  "scripts": {
    "test": "spedue test"
  }
}
```

This will automatically start in watch mode but can be ran in a one-off situation by adding the `—-noWatch` flag. Because each project is scaffolded with TypeScript, jest will load `ts-jest` as a preset for you. 

If there is additional configuration required to run your tests (i.e., test in a different location, etc.). Spedue will look for additional configuration in your package.json’s `jestConfig` object. 

**example**
```json
{
  "jestConfig": {
    "testRegex": "\\.*"
  }
}
```

Any additional test setup that is required to run before your tests run can be put into a file in `src/setupTests.ts` . 

Other than above, everything should work as expected from jest. 

### Eslint/Prettier 
Like testing, linting with Eslint, comes preconfigured. This section is a bit more opinionated and specific to personal preferences but can be reconfigured. When you run `create-spedue-app`  the generated package.json comes with two keys: “eslintConfig” and “prettier”, each of which reference a sped package that consists of my own configuration that I generally use for my projects. 

### Typescript
They typescript compiler comes setup inside `@spedue/scripts` but the actual configuration associated with `tsconfig.json` is copied in on a per template basis and can be completely changed to align with personal preference. 

### Git hooks
Upon running `create-spedue-app` a git repository is created and setup for you with your initial commit. Along with basic git, three git hooks are copied over for you as well: commit-msg, pre-commit, and pre-push.  These three bash scripts utilize the yarn scripts in your package.json. 

> If you do not like these you can either delete the corresponding hooks in `.git/hooks` or commit with the `--no-verify` flag

#### Commit Msg
Commit messages are automatically checked according to [Conventional Changelog Standards][6]. 

**example**
```raw
feat(header): add new button
```

#### Pre Commit
Will automatically run the linter and compiler on any **changed files**. In essence the following bash script is run anytime you commit: 

```bash
yarn lint *.jsx?
yarn lint *.tsx?
yarn compile
```

#### Pre Push
Will automatically run all tests associated with your project. This is the equivalent to running the following bash script anytime you push: 

```bash
yarn test —-noWatch
```

## Templates
Currently there are only 5 templates that I’ve written, each of which is modeled after how CRA writes their templates. 

| Template Name | CLI Option | 
|:--------------|:-----------|
| React (default) | `--template=react` |
| NextJS | `--template=nextjs` |
| Gatsby | `--template=gatsby` |
| Component Library | `--template=library` |
| Lerna Mono Repo | `--template=mono` |

## Disclaimers
Yes this project is a cheap ripoff of the [Create React App][3] project but I personally wanted to spend some time really digging into how all the moving parts of that project work. How do you configure Webpack, Babel, Jest, TypeScript etc.? It’s actually setup to my personal preferences and does a little bit more than just React (such as Next, Gatsby, and Lerna) but at the end of the day its just that, it’s *my* preferences. If you see any bugs or have any recommendations feel free to submit a PR 😄

<!-- I actually wrote a Blog Post about my process and why you should understand the details of your tools, why you should write your own, and why it’s okay to still use the big name tools like CRA.  -->

## What is “Spedue”?
**Pronounced** SpEh-Doo

> There are only two hard things in Computer Science: cache invalidation and naming things.
> — Phil Karlton

Naming things is really hard, especially when it comes to naming a library  and there are so many libraries out there with cool names (i.e., React,  Angular, Electron,  [Fartscroll.js][1]?) So I just opted for picking something that might sound like something random that might be said as an exclamation. Something akin to the “Bleep Bloops” that R2D2 makes or Kung Fu Panda’s catch phrase “Skadoosh” 

![R2D2](media/r2d2.gif)

![Kung Fu Panda Skadoosh](media/skadoosh.gif)

## Inspiration
This plugin was highly influenced by: 
- [Create React App][3]
- [Husky][4]
- [Lint Staged][5]

[1]: https://brainhub.eu/blog/funny-javascript-libraries/
[2]: https://www.youtube.com/watch?v=G39lKaONAlA
[3]: https://github.com/facebook/create-react-app
[4]: https://github.com/typicode/husky
[5]: https://github.com/okonet/lint-staged
[6]: https://github.com/conventional-changelog/conventional-changelog
