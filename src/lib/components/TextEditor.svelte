<script lang="ts">
    import type Quill from "quill";
    import { onMount } from "svelte";

    let editor: HTMLElement;

    export let toolbarOptions = [
        [{ header: 1 }, { header: 2 }, "blockquote", "link"],
        ["bold", "italic", "underline", "strike"],
    ];

    export let quill: Quill | null = null;
    export let content: any = null;
    export let placeholder: string | undefined = undefined;

    $: content, quill?.setContents(content);

    onMount(async () => {
        const { default: Quill } = await import("quill");

        quill = new Quill(editor, {
            modules: {
                toolbar: content !== null ? false : toolbarOptions,
            },
            theme: "snow",
            placeholder,
            readOnly: content !== null,
        });

        if (content !== null) {
            quill.setContents(content);
        }
    });
</script>

<div class={content !== null ? "readonly" : ""}>
    <div bind:this={editor} />
</div>

<style>
    @import "https://cdn.quilljs.com/1.3.6/quill.snow.css";

    :global(.ql-editor) {
        font-size: larger;
    }

    :global(.readonly .ql-editor) {
        padding: 0;
    }

    :global(.readonly .ql-container.ql-snow) {
        border: none;
    }
</style>
