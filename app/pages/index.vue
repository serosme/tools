<script setup lang="ts">
function openGoogle() {
  window.open('https://google.com')
}

function openGithub() {
  window.open('https://github.com')
}

const groups = [
  {
    id: 'pages',
    label: 'Pages',
    items: [
      {
        label: 'To Music',
        icon: 'i-lucide-globe',
        onSelect() {
          navigateTo('/music')
        },
      },
      {
        label: 'To Test',
        icon: 'i-lucide-globe',
        onSelect() {
          navigateTo('/test')
        },
      },
    ],
  },
  {
    id: 'apps',
    label: 'Applications',
    items: [
      {
        label: 'Open Google',
        icon: 'i-lucide-globe',
        onSelect() {
          openGoogle()
        },
      },
      {
        label: 'Open Github',
        icon: 'i-lucide-github',
        onSelect() {
          openGithub()
        },
      },
    ],
  },
]
</script>

<template>
  <UCommandPalette
    :groups="groups"
  />
</template>
