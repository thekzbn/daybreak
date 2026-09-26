<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project architecture

- Daybreak stores all personal records in Lovable Cloud tables protected by per-user access rules, because account data must remain private.
- The desktop is a single interactive home route with internal window state, because the product behaves as an operating system rather than a conventional page hierarchy.
- Daily rollover is derived from each record's local date, because opening a new date should not require a fragile background task.
