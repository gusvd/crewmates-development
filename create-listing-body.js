// Scripts to run after Webflow is ready 
var Webflow = Webflow || [];
Webflow.push(function() {

    ////////////////////////////////////////////////////////////
    // Load MemberStack member ID into form

    MemberStack.onReady.then(function(member) {
        document.getElementById('memberstack-id').value = member.id;
    })


    ////////////////////////////////////////////////////////////
    // Add date picker to form field

    var picker = new Pikaday({
        field: document.getElementById('departure-date'),
        format: 'DD/MM/YYYY',
        minDate: moment().toDate()
    });
    

    ////////////////////////////////////////////////////////////
    // Pre-fill expenses filed with 0.00
    document.getElementById('expenses-onboard').value = "0.00";

 
    ////////////////////////////////////////////////////////////
    // GOOGLE MAPS AUTO COMPLETE
    var placeSearch, autocomplete;

    function initAutocomplete() {
        // Create the autocomplete object, restricting the search predictions to
        // geographical location types.
        autocomplete = new google.maps.places.Autocomplete(
            document.getElementById('gmaps-autocomplete')
        );

        // Avoid paying for data that you don't need by restricting the set of
        // place fields that are returned to just the address components.
        autocomplete.setFields(['departure-location']);

    };


    ////////////////////////////////////////////////////////////
    // PARSLEY MULTI-STEP FORM

    $(function() {
        var $sections = $('.form-section');

        function navigateTo(index) {
            // Mark the current section with the class 'current'
            $sections
                .removeClass('current')
                .eq(index)
                .addClass('current');
            // Show only the navigation buttons that make sense for the current section:
            $('.form-navigation .previous').toggle(index > 0);
            var atTheEnd = index >= $sections.length - 1;
            $('.form-navigation .next').toggle(!atTheEnd);
            $('.form-navigation [type=submit]').toggle(atTheEnd);
        }

        function curIndex() {
            // Return the current index by looking at which section has the class 'current'
            return $sections.index($sections.filter('.current'));
        }

        // Previous button is easy, just go back
        $('.form-navigation .previous').click(function() {
            navigateTo(curIndex() - 1);
        });

        // Next button goes forward iff current block validates
        $('.form-navigation .next').click(function() {
            $('.multi-step-form').parsley().whenValidate({
                group: 'block-' + curIndex()
            }).done(function() {
                navigateTo(curIndex() + 1);
            });
        });

        // Prepare sections by setting the `data-parsley-group` attribute to 'block-0', 'block-1', etc.
        $sections.each(function(index, section) {
            $(section).find(':input').attr('data-parsley-group', 'block-' + index);
        });
        navigateTo(0); // Start at the beginning
    });

});
