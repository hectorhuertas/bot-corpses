Liz Bot
---

This is the home of liz, our hopefully beloved bot here @ repositive.

The bot uses the official [Slack SDK](http://slackapi.github.io/node-slack-sdk/bots) and it's based mainly on it's RTM capabilities.

**Extending It**

Create your implementation in `src/main/plugins`. The main file of your plugins should be named `<whatever>.plug.ts` and expose a function for it to be loaded by the system. This function will receive an instance of the initial state

```ts
interface State {
  rtm: RealTimeClient; // Instance from the Slack Library
  startResult: RtmStartResult;
}
```

**Considerations**

The repository has git hooks on `precommit` and `prepush`. You need to pass the linting criteria before commit and the test and coverage criteria before push. The test requirements are 80% overall.

The only file that is not evaluated during testing is the `index.ts`. DO NOT MODIFY THIS FILE unless is completely necessary. 
