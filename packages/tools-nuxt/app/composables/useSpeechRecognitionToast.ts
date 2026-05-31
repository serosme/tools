export function useSpeechRecognitionToast() {
  const toast = useToast()

  let id: string | number | undefined

  const add = () => {
    const t = toast.add({
      title: '录音中...',
      duration: 0,
    })
    id = t.id
  }

  const update = (title: string) => {
    if (id) {
      toast.update(id, {
        title,
        duration: 0,
      })
    }
  }

  const remove = () => {
    if (id) {
      toast.remove(id)
    }
  }

  return {
    add,
    update,
    remove,
  }
}
