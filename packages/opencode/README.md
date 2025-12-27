# js

To install dependencies:

```bash
rm -rf bun.lockb bun.lock node_modules
rm -rf bun.lock* node_modules


bun install


# update bun to latest version
bun upgrade
```

To run:

```bash
bun run index.ts
```

To push code:

```bash
git pull origin dev

git push origin son.ct1 --no-verify
```


Install opencode local:
```bash
./build-and-replace.sh
```

This project was created using `bun init` in bun v1.2.12. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
