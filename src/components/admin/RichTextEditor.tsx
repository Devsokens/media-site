import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Bold, Italic, List, Link as LinkIcon, Heading as HeadingIcon, Quote, Code, ListOrdered, Undo, Redo, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
            }),
            Image,
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm xl:prose-lg max-w-none focus:outline-none min-h-[500px] p-6 [&_img]:max-w-sm [&_img]:rounded-lg [&_img]:shadow-sm [&_img]:mx-auto',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Updates editor content if value changes externally (e.g. initial load)
    useEffect(() => {
        if (editor && value && editor.getHTML() !== value) {
            // Only set content if it's different to avoid cursor jumping or infinite loops
            // For initial load mainly.
            if (editor.isEmpty) {
                editor.commands.setContent(value);
            }
        }
    }, [value, editor]);


    if (!editor) {
        return null;
    }

    const addImage = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const url = reader.result as string;
                editor.chain().focus().setImage({ src: url }).run();
            };
            reader.readAsDataURL(file);
        }
        // Reset input so same file can be selected again if needed
        e.target.value = '';
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="border border-input rounded-md overflow-hidden bg-background">
            <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/30 border-b border-input sticky top-0 z-10">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'bg-muted' : ''}
                    title="Gras"
                >
                    <Bold size={16} />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'bg-muted' : ''}
                    title="Italique"
                >
                    <Italic size={16} />
                </Button>
                <div className="w-px h-4 bg-border mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
                    title="Titre 2"
                >
                    <HeadingIcon size={16} className="h-4 w-4" />
                    <span className="text-[10px] font-bold absolute mb-[-8px] ml-[8px]">2</span>
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
                    title="Titre 3"
                >
                    <HeadingIcon size={16} className="h-4 w-4" />
                    <span className="text-[10px] font-bold absolute mb-[-8px] ml-[8px]">3</span>
                </Button>
                <div className="w-px h-4 bg-border mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'bg-muted' : ''}
                    title="Liste à puces"
                >
                    <List size={16} />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'bg-muted' : ''}
                    title="Liste numérotée"
                >
                    <ListOrdered size={16} />
                </Button>
                <div className="w-px h-4 bg-border mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={setLink}
                    className={editor.isActive('link') ? 'bg-muted' : ''}
                    title="Lien"
                >
                    <LinkIcon size={16} />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addImage}
                    title="Image"
                >
                    <ImageIcon size={16} />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('blockquote') ? 'bg-muted' : ''}
                    title="Citation"
                >
                    <Quote size={16} />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive('codeBlock') ? 'bg-muted' : ''}
                    title="Code"
                >
                    <Code size={16} />
                </Button>
                <div className="ml-auto flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                    >
                        <Undo size={16} />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                    >
                        <Redo size={16} />
                    </Button>
                </div>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
};
