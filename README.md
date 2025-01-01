# README

### For tailwind intellisense support for NextUI

add this to `settings.json` in .vscode

```jsonc
{
    "tailwindCSS.classAttributes": [
        "class",
        "className",
        "classNames" // nextUI uses classNames attribute
    ]
}
```