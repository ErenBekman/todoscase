<template>
    <div>
        <v-list lines="one">
            <div class="d-flex justify-space-between align-center">
                <v-text-field
                    v-model="search_todo"
                    @input="searchTodo"
                    width="45%"
                    class="rounded-sm mr-2"
                    label="Search Todo"
                    placeholder="Search Todo"
                    append-inner-icon="mdi-magnify"
                    hide-details="auto"
                    variant="outlined"
                    clearable
                />

                <v-text-field
                    v-model="search_tags"
                    @input="searchTags"
                    width="45%"
                    class="rounded-sm ml-2"
                    label="Search Tags"
                    placeholder="Search Tags"
                    append-inner-icon="mdi-magnify"
                    hide-details="auto"
                    variant="outlined"
                    clearable
                />
            </div>

            <div class="d-flex justify-space-between align-center">
                <h3 class="my-4">Tasks</h3>
                <v-btn color="primary" @click="createDialog = true">
                    <v-icon>mdi-plus</v-icon>
                    Add Task
                </v-btn>
            </div>            
            <v-divider />

            <todo-item
                v-if="pendingTodos"
                v-for="todo in pendingTodos"
                :todo="todo"
                :key="todo._id"
                @removeTodo="() => removeTodo(todo._id)"
                @completeTodo="() => completeTodo(todo._id)"    
                @editTodo="() => openEditDialog(todo)"
            />

            <div v-if="completedTodos.length">
                <h3 class="my-4">Completed</h3>
                <v-divider />

                <todo-item
                    v-if="completedTodos"
                    v-for="todo in completedTodos"
                    :todo="todo"
                    :key="todo._id"
                    @removeTodo="() => removeTodo(todo._id)"
                    @completeTodo="() => completeTodo(todo._id)"    
                    @editTodo="() => openEditDialog(todo)"
                />
            </div>

            <!-- Create Dialog -->
            <v-dialog v-model="createDialog" width="450">
                <v-card>
                    <v-card-title>
                        <h3>Add Todo</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field
                            v-model="new_todo"
                            class="rounded-sm"
                            label="New Todo"
                            placeholder="Enter a new todo"
                            prepend-inner-icon="mdi-circle-outline"
                            hide-details="auto"
                            variant="outlined"
                            clearable
                        />

                        <v-combobox
                            v-model="selectTags"
                            :items="[]"
                            width="100%"
                            class="rounded-sm mt-2"
                            label="Tags"
                            chips
                            multiple
                            hide-details="auto"
                            variant="outlined"
                        />

                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" variant="outlined" @click="createDialog = false">
                            Cancel
                        </v-btn>
                        <v-btn color="primary" variant="flat" @click="createTodo">
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <!-- Edit Dialog -->
            <v-dialog v-model="dialog" width="450">
                <v-card>
                    <v-card-title>
                        <h3>Edit Todo</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field
                            v-model="editedTodo.text"
                            label="Edit Task"
                            prepend-inner-icon="mdi-circle-edit-outline"
                            hide-details="auto"
                            variant="outlined"
                            class="rounded-sm"
                            clearable
                        />

                        <v-combobox
                            v-model="editedTodo.tags"
                            :items="editedTodo.tags"
                            class="rounded-sm mt-2"
                            label="Edit Tags"
                            chips
                            multiple
                            hide-details="auto"
                            variant="outlined"
                        />

                        <p class="mt-4"> Optional </p>
                        <v-divider />

                        <v-file-input
                            v-model="file"
                            @change="onFileChange"
                            accept="application/pdf"
                            label="Add File"
                            prepend-icon=""
                            prepend-inner-icon="mdi-paperclip"
                            chips
                            hide-details="auto"
                            variant="outlined"
                            class="rounded-sm mt-2"
                            clearable
                        />
                        <v-file-input
                            accept="image/*"
                            v-model="image"
                            @change="onImageChange"
                            label="Thumbnail"
                            prepend-icon=""
                            prepend-inner-icon="mdi-image-outline"
                            chips
                            hide-details="auto"
                            variant="outlined"
                            class="rounded-sm mt-2"
                            clearable
                        />
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" variant="outlined" @click="dialog = false">
                            Cancel
                        </v-btn>
                        <v-btn color="primary" variant="flat" @click="editTodo">
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <!-- <todo-clear-buttons @clearCompleted="$emit('clearCompleted')" @clearAll="$emit('clearAll')" /> -->
        </v-list>
    </div>
</template>

<script setup>
    import TodoItem from '@/components/todos/TodoItem.vue';
    import TodoClearButtons from '@/components/todos/TodoClearButtons.vue';

    import { ref, computed } from 'vue';
    import { useTodoStore } from '@/stores/todo';
    import { api } from "@/utils/axios";
    const todoStore = useTodoStore()
    todoStore.fetchTodos();
    let todos = computed(() => todoStore.todos || []);
    
    const dialog = ref(false);
    const createDialog = ref(false);
    const editedTodo = ref(null);
    const search_tags = ref('');
    const search_todo = ref('');
    const new_todo = ref('');
    const selectTags = ref([]);
    const file = ref(null);
    const image = ref(null);

    const completedTodos = computed(() => todos.value.filter(todo => todo?.isCompleted));
    const pendingTodos = computed(() => todos.value.filter(todo => !todo?.isCompleted));
    
        
    const createTodo = () => {
        todoStore.addTodo({ text: new_todo.value, tags: selectTags.value });
        createDialog.value = false;
        new_todo.value = '';
        selectTags.value = [];
    }

    const searchTodo = () => {
        todoStore.searchTodos(search_todo.value);
    }

    const searchTags = () => {
        todoStore.searchTags(search_tags.value);
    }

    const removeTodo = (id) => {
        todoStore.removeTodo(id);
    }

    const completeTodo = (id) => {
        todoStore.completeTodo(id)
    }

    function onFileChange(event) {
        file.value = event.target.files[0];
    }

    function onImageChange(event) {
        image.value = event.target.files[0];
    }

    const editTodo = async () => {
        let todo = {
            ...editedTodo.value,
            tags: editedTodo.value.tags,
            image: image.value,
            file: file.value
        }
    
        todoStore.editTodo(todo);

        dialog.value = false;
        // editedTodo.value = null;
        file.value = null;
        image.value = null;
    }

    const openEditDialog = (todo) => {
        editedTodo.value = { ...todo };
        dialog.value = true;
    };
</script>

<style lang="scss" scoped>

</style>