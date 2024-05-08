<template>
    <v-list-item>
        <template v-slot:prepend>
            <v-btn 
                :icon="todo.isCompleted ? 'mdi-check-circle' : 'mdi-circle-outline'"
                variant="text" 
                size="small" 
                @click="() => $emit('completeTodo')" 
            />
            <v-avatar :size="34" v-if="todo.image">
                <v-img :src="todo.image" />
            </v-avatar>
        </template>

        <v-list-item-title>
            <div :class="{ 'text-decoration-line-through blurred': todo.isCompleted }">
                <span>{{ todo.text }}</span>
                <br />
                <v-chip 
                    v-if="todo.tags.length > 0"
                    v-for="tag in todo.tags" 
                    :key="tag"
                    size="x-small"
                    variant="tonal"
                    color="blue-grey"
                > 
                    {{ tag }}
                </v-chip>

                <v-chip 
                    v-if="todo.file"
                    size="x-small"
                    variant="tonal"
                    color="dark-grey"
                    class="ma-2"
                    label
                    @click="downloadFile(todo.file)"
                > 
                    <v-icon icon="mdi-download" start></v-icon>
                    {{ todo?.file?.split('/').pop() }}
                </v-chip>
            </div>
        </v-list-item-title>
        
        <template v-slot:append>
            <v-btn color="red-lighten-1" icon="mdi-delete" variant="text" size="small" @click="() => $emit('removeTodo')" />
            <v-btn color="blue-lighten-1" icon="mdi-pencil" variant="text" size="small" @click="() => $emit('editTodo')" />
        </template>
    </v-list-item>
</template>

<script setup>
import fileDownload from 'js-file-download';


const props = defineProps({
    todo: Object
})

const downloadFile = (file) => {
    fileDownload(file, file.split('/').pop());
}

</script>

<style lang="scss" scoped>
.blurred {
  filter: blur(0.5px);
}
</style>