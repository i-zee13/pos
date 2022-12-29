$(document).ready(function() {
    $(document).on('click', '.openDataSidebarForAddingMessage', function() {
        openSidebar();
        $('#operation').val('add');
        $('#dataSidebarLoader').hide();
        $('.form_div').show();
        $('._cl-bottom').show();
        $('.pc-cartlist').show();
    })
    //Function for Fetch CKEditor
    // let theEditor;
    // ClassicEditor
    // .create(document.querySelector('#content_details'))
    // .then(editor => {
    //    theEditor = Editor;   
    // })
    // .catch(error => {
    //     console.error(error);
    // });
    // function getDataFromTheEditor() {
    //     return theEditor.getData();
    // }
    CKEDITOR.replace('editor_value',{
        height: 280,
        contentsCss: [
        'css/menu.css?v=6.4'
        ],
        format_tags: 'p;h1;h2;h3;h4;h5;h6;pre;div',
        format_h1: {
        element: 'h1',
        attributes: {
            'class': '_head01'
        }
        },
        format_h2: {
        element: 'h2',
        attributes: {
            'class': '_head02'
        }
        },
        format_h3: {
            element: 'h3',
            attributes: {
                'class': '_head03'
            }
        },
        format_h4: {
            element: 'h4',
            attributes: {
                'class': '_head04'
            }
        },
        format_h5: {
            element: 'h5',
            attributes: {
                'class': '_head05'
            }
        },
        format_h6: {
            element: 'h6',
            attributes: {
                'class': '_head06'
            }
        },
        format_pre: {
        element: 'pre',
        attributes: {
            'class': 'formattedCode'
        }
        },
        removeButtons: 'PasteFromWord',
        removePlugins: 'about,maximize',
        fontSize_sizes: '12 Pixels/12px;Big/2.3em;30 Percent More/130%;Bigger/larger;Very Small/x-small'
       
    });
    
    // function getDataFromTheEditor() {
    //     return theEditor.getData();
    // }
    //End Function for CKEditor
    $(document).on('click', '#saveMessage', function() {
       alert(CKEDITOR.instances.editor_value_id.getData());
       return;
    })

})