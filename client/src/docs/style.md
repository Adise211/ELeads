# Using shadcn/ui and Tailwind CSS in This Project

This project uses [shadcn/ui](https://ui.shadcn.com/) components together with [Tailwind CSS](https://tailwindcss.com/) for building the UI.

## What We Use

- **shadcn/ui**: A collection of beautifully designed, accessible React components built with Radix UI and styled with Tailwind CSS.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

## Installation

1.  **Install Tailwind CSS** (if not already installed):

    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```

    Configure your `tailwind.config.js` as needed.

2.  **Install shadcn/ui CLI**:

    ```bash
    npx shadcn-ui@latest init
    ```

    Follow the prompts to set up shadcn/ui in your project.

3.  **Install Radix UI Primitives** (as needed, shadcn/ui will prompt you):
    ```bash
    npm install @radix-ui/react-<component>
    ```

## Adding a Component

To add a new UI component from shadcn/ui, use the `add` command:

```bash
npx shadcn-ui@latest add <component>
```

For example, to add a button:

```bash
npx shadcn-ui@latest add button
```

All added components will be placed in the `components/ui` directory.

## Custom Components

- Any file in `components/ui` with the prefix `app-*` (e.g., `app-alert.tsx`) is typically a custom component.
- These custom components are either built using Radix UI primitives or are wrappers around native HTML elements, tailored for this project.

## Notes

- Always check the [shadcn/ui documentation](https://ui.shadcn.com/docs) for the latest usage patterns and available components.
- You can customize the generated components as needed, but try to keep custom changes in `app-*` files to make upgrades easier.
