# Build, package and fixture workflow

Run from this checkout with the project-pinned Mise tools:

```sh
mise install
mise run theme:build
mise run theme:check
mise run theme:check-safety
```

The build reads `theme/mega-city-one/source/`, not ignored design history or live
Omarchy templates. It writes `dist/mega-city-one/` with these independent payloads:

| Directory | Purpose |
|---|---|
| theme/ | Ordinary theme data/configuration, wallpapers and optional asset files |
| plugins/ | Optional companions; not copied or enabled by theme installation |
| sddm/mega-city-one/ | Separate login theme; not installed by theme installation |
| preview/ | Generated palette/font/asset specimen; not a live desktop |

The manifest hashes payload files. Package check rejects changed/missing/extra
files, symlinks and escaping paths. It checks integrity, not publisher identity.
Building requires native `rsvg-convert` and `xcursorgen`; application checks have
additional [test dependencies](test-environment.md). Fonts retain their notices.

## Explicit disposable HOME

The project installer is fixture-only and refuses the actual user's HOME. Create
an existing dedicated fixture directory, then use:

```sh
mise run theme:install -- --dry-run --target-home /absolute/fixture-home
mise run theme:install -- --target-home /absolute/fixture-home
mise run theme:remove -- --dry-run --target-home /absolute/fixture-home
mise run theme:remove -- --target-home /absolute/fixture-home
```

It stages `.config/omarchy/themes/mega-city-one/` and records ownership under
`.local/state/thememe/mega-city-one/`. A pre-existing directory is retained for
restoration; identical reapplication is a no-op. Updates retain the original
recovery copy. Edited installed files/backups, redirected paths and unexpected
removal state are refused. Preserve state for reconciliation instead of deleting
it to force an operation. This is not power-loss durability.

## Fixture font configuration

After fixture installation, `theme:configure` and `theme:unconfigure` with the same
explicit `--target-home` own only Foot font slots and the generated Fontconfig
registration. Original bytes/modes are retained. Unconfigure before updating or
removing the fixture package. Other settings, icons, cursor registration, GTK
imports, companion activation and greeter selection are outside these commands.

## Public installation is not ready

The [source repository](https://github.com/SurreptitiousFabric/Drokk) is public.
A supported host installer and standalone release payloads are not published. A theme-only
release needs the native payload at its root; cloning this development repository
into Omarchy's themes directory is not the intended layout. Test through the
actual native Git-install/staging path, which may filter executable overrides.
Do not bypass filtering by presenting a manual copy as equivalent acceptance.
See [compatibility](compatibility.md) for the distribution matrix and remaining
release work. Local companion removal/reinstallation and theme switching now pass;
the user confirmed successful login after reboot on 2026-10-17. The public install
route and clean independent installation remain unverified. See [lifecycle](theme-switching.md).
