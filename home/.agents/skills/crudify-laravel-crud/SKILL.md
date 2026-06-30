# Skill: crudify-laravel-crud

Generate full CRUD operations in Laravel with Livewire v4 components.

## Overview

This skill helps generate complete CRUD (Create, Read, Update, Delete) functionality in Laravel applications using Livewire v4 single-file components. It produces production-ready code following Laravel best practices.

## When to Use

Use this skill when the user wants to:
- Create CRUD operations for a Laravel model
- Generate Livewire v4 components for CRUD pages
- Auto-generate migrations, controllers, policies, and form requests
- Set up search, sorting, and pagination
- Follow Laravel conventions for file structure

## Commands

### Generate Full CRUD

```bash
php artisan crudify:generate ModelName --fields="field:type:modifiers"
```

### Generate from YAML

```bash
php artisan crudify:generate --file=definition.yaml
```

### Publish Stubs

```bash
php artisan crudify:stubs
```

## Field Syntax

### CLI Format

```
name:type:modifier1:modifier2:default:value
```

**Types:** `string`, `text`, `integer`, `bigint`, `float`, `boolean`, `date`, `datetime`, `json`, `uuid`, `foreign`

**Modifiers:** `nullable`, `unique`, `index`, `default:value`, `foreign:table`

### Examples

```bash
# Simple fields
php artisan crudify:generate Post --fields="title:string,body:text,is_published:boolean"

# With modifiers
php artisan crudify:generate Product --fields="name:string:nullable|unique,price:float:default:0,category_id:foreign:categories"

# With foreign keys
php artisan crudify:generate Article --fields="title:string,author_id:foreign:users:nullable"
```

## YAML Format

Create a YAML definition file:

```yaml
model: Post

fields:
  title:
    type: string
    nullable: false
    unique: true
  slug:
    type: string
    nullable: false
    unique: true
    index: true
  body:
    type: text
    nullable: false
  is_published:
    type: boolean
    default: false
  published_at:
    type: datetime
    nullable: true
  author_id:
    type: foreign
    foreign: users
    nullable: false

searchable:
  - title
  - body

options:
  soft_deletes: false
```

Then run:
```bash
php artisan crudify:generate --file=post.yaml
```

## Generated Files

For a `Post` model, generates:

```
app/
├── Models/
│   └── Post.php
├── Http/
│   ├── Controllers/
│   │   └── PostsController.php
│   └── Requests/
│       ├── StorePostRequest.php
│       └── UpdatePostRequest.php
├── Policies/
│   └── PostPolicy.php

database/migrations/
└── xxxx_xx_xx_xxxxxx_create_posts_table.php

resources/views/livewire/pages/posts/
├── ⚡index.blade.php      # Livewire v4 single-file component
├── ⚡create.blade.php     # Livewire v4 single-file component
├── ⚡edit.blade.php       # Livewire v4 single-file component
├── ⚡show.blade.php       # Livewire v4 single-file component
├── index.blade.php        # View template
├── create.blade.php       # View template
├── edit.blade.php         # View template
└── show.blade.php         # View template

routes/web.php (auto-appended with routes)
```

## Livewire v4 Features

### Index Component
- Search with debounce
- Column sorting (click headers to toggle asc/desc)
- Pagination (10, 25, 50, 100 per page)
- Responsive Tailwind table

### Create/Edit Components
- Auto-generated form fields based on field types
- Validation with `#[Validate]` attributes
- Error display with `@error` directives
- Redirect on success with flash messages

### Show Component
- Display all model fields
- Edit button
- Delete with confirmation dialog

## Command Options

| Option | Description |
|--------|-------------|
| `--fields=` | Comma-separated field definitions |
| `--file=` | Path to YAML definition file |
| `--only=` | Generate only specified types (model,migration,controller,form-request,policy,livewire,route) |
| `--skip=` | Skip specified types |
| `--soft-delete` | Add soft deletes to model |
| `--searchable=` | Comma-separated searchable fields |

## Examples

### Blog Post
```bash
php artisan crudify:generate Post \
  --fields="title:string:nullable|unique,slug:string:nullable|unique,body:text,is_published:boolean:default:0,published_at:datetime:nullable" \
  --searchable=title,body
```

### Product with Category
```bash
php artisan crudify:generate Product \
  --fields="name:string:nullable,slug:string:nullable|unique,description:text,price:float:default:0,stock:integer:default:0,is_active:boolean:default:1,category_id:foreign:categories"
```

### User Profile
```bash
php artisan crudify:generate Profile \
  --fields="user_id:foreign:users:unique,bio:text:nullable,avatar:string:nullable,website:string:nullable,location:string:nullable"
```

## Requirements

- PHP ^8.2
- Laravel ^11.0|^12.0
- Livewire ^4.0
- Layout file at `resources/views/components/layouts/app.blade.php`

## Layout Setup

Ensure you have a Livewire-compatible layout:

```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title ?? config('app.name') }}</title>
    @livewireStyles
</head>
<body>
    {{ $slot }}
    @livewireScripts
</body>
</html>
```

## Customization

### Customize Stubs
```bash
php artisan crudify:stubs
```
This publishes stubs to `stubs/crudify/` for customization.

### Modify Generated Code
After generation, you can:
- Add custom validation rules in Form Request classes
- Modify policy logic in Policy classes
- Customize Livewire component behavior
- Update Blade views with custom styling

## Best Practices

1. **Always backup** before running generators on existing projects
2. **Review generated code** before committing
3. **Customize stubs** for team consistency
4. **Use YAML** for complex models with many fields
5. **Test generated CRUD** thoroughly before deployment
6. **Add authorization** logic to policies
7. **Customize validation** rules in Form Requests

## Troubleshooting

### "Layout not found"
Ensure `resources/views/components/layouts/app.blade.php` exists.

### "Route not found"
Check that routes were added to `routes/web.php`.

### "Class not found"
Run `composer dump-autoload` after generation.

### Validation not working
Check that Form Request classes are properly type-hinted in controller methods.

## Related Skills

- `laravel-best-practices` - General Laravel conventions
- `livewire-components` - Livewire component patterns
- `ui-ux-pro-max` - UI/UX design for generated views
