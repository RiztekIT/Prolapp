function editTableJS() {



    $('#mainTable').editableTableWidget().numericInputExample().find('td:first').focus();
    $('#editable-datatable').editableTableWidget().numericInputExample().find('td:first').focus();
    $(document).ready(function() {
        $('#editable-datatable').DataTable();
    });
    $('#mainTable').editableTableWidget().numericInputExample().find('td:first').focus();
    $('#editable-datatable2').editableTableWidget().numericInputExample().find('td:first').focus();
    $(document).ready(function() {
        $('#editable-datatable2').DataTable();
    });
    $('#mainTable').editableTableWidget().numericInputExample().find('td:first').focus();
    $('#editable-datatable3').editableTableWidget().numericInputExample().find('td:first').focus();
    $(document).ready(function() {
        $('#editable-datatable3').DataTable();
    });

}