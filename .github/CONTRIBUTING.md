# Contributing

First, read our [code of conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Workflow

### Before coding
- Read the [`README`](/README.md) file.
- Install the project on your machine.
- Launch tests (_if there're any_).
- Check if there's no "easy" task to take from the issues list.

### Conception/Testing
- While this may look surprising at first, you should [create your tests
before](http://sd.jtimothyking.com/2006/07/11/twelve-benefits-of-writing-unit-tests-first/) doing any code-related work.

### Coding/Git atomic commit
- An [atomic commit](https://seesparkbox.com/foundry/atomic_commits_with_git) is:
  - one irreducible "type" (see the complete list [below](#git-commit-messages))
  - generally small therefore faster to comprehend
  - ease the review for finding typos or bugs.
- Try to describe the "why" vs the "what" in your commit messages.
- Use `git add -p` before `git commit`, it's always better to make a review of your changes by yourself before other can see your code.

### Preparing your code review
- Don't forget to launch the test runner before creating the Pull Request
- Write your PR based on the [template](PULL_REQUEST_TEMPLATE.md)
- Request a review to at least 2 people
- You're encourage to rewrite your `git` [commit history](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History) if you got redundant commits for example. 

### Code review process
- You need at least one "approved" review to get your code merged into the "master" branch
- If approved, it's the reviewer responsability to merge your PR.
- If some changes are requested, you'll code the fixes and then add it to your commit history using [`git fixup`](http://fle.github.io/git-tip-keep-your-branch-clean-with-fixup-and-autosquash.html)
  - After commiting your fixups, it's best to add the "status:need-rebase" label so reviewers will not accidently merged your PR
  - If your fixups are approved then it's **your** responsability to merge your PR since you need to rewrite the history (_using `git rebase --autosquash`_).

## Styleguides

### Git commit messages
- Use the [angular](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits) commit style
- commit prefixes explanation:
  - `chore`: everything related to maintenance around the code (gulp, travis, fixtures, etc)
  - `docs`: related to documentation (README, code comments, etc)
  - `feat`: new functionality
  - `fix`: bugfix(es)
  - `refactor`: code improvement, removal of uneeded pieces
  - `style`: whitespace changes
  - `test`: code used for tests (unit & functional)

### Code styleguide
- Use an [editorconfig](http://editorconfig.org/#download) plugin for your IDE.
- Use an [eslint](http://eslint.org/docs/user-guide/integrations) plugin for your IDE.

### Documentation styleguide
- Use [github-flavoured markdown](https://guides.github.com/features/mastering-markdown/).
- Use direct phrases, omit needless words and [follow this guide](http://www.writethedocs.org/guide/writing/docs-principles/).

:+1::tada: Happy coding! :tada::+1:
