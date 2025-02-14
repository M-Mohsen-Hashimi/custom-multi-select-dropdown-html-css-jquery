$(document).ready(function () {
  const customSelects = $(".custom-select");

  function updateSelectedOptions(customSelect) {
    const selectedOptions = customSelect
      .find(".option.active")
      .not(customSelect.find(".option.all-tags"))
      .map(function () {
        return {
          value: $(this).attr("data-value"),
          label: $(this).text().trim(),
        };
      })
      .get();

    const selectedValues = selectedOptions.map((option) => option.value);
    customSelect.find(".tags_input").val(selectedValues.join(", "));

    let tagsHTML = "";

    if (selectedOptions.length === 0) {
      tagsHTML = '<span class="placeholder">Select the tags</span>';
    } else {
      const maxTagsToShow = 3;
      let additionalTagsCount = selectedOptions.length - maxTagsToShow;

      selectedOptions.forEach((option, index) => {
        if (index < maxTagsToShow) {
          tagsHTML += `<span class="tag">${option.label}<span class='remove-tag' data-value="${option.value}">&times;</span></span>`;
        }
      });

      if (additionalTagsCount > 0) {
        tagsHTML += `<span class="tag">+${additionalTagsCount}</span>`;
      }
    }

    customSelect.find(".selected-options").html(tagsHTML);
  }

  customSelects.each(function () {
    const customSelect = $(this);
    const searchInput = customSelect.find(".search-tags");
    const optionsContainer = customSelect.find(".options");
    const noResultMessage = customSelect.find(".no-result-message");

    const options = customSelect.find(".option");
    const allTagsOption = customSelect.find(".option.all-tags");
    const clearButton = customSelect.find(".clear");

    allTagsOption.on("click", function () {
      const isActive = allTagsOption.hasClass("active");
      options.each(function () {
        if (!$(this).is(allTagsOption)) {
          $(this).toggleClass("active", !isActive);
        }
      });

      updateSelectedOptions(customSelects);
    });

    clearButton.on("click", function () {
      searchInput.val("");
      options.css("display", "block");
      noResultMessage.css("display", "block");
    });

    searchInput.on("input", function () {
      const searchTerm = searchInput.val().toLowerCase();
      options.each(function () {
        const optionText = $(this).text().trim().toLowerCase();
        const shouldShow = optionText.includes(searchTerm);
        $(this).css("display", shouldShow ? "block" : "none");
      });

      const anyOptionsMatch = options.filter(":visible").length > 0;
      noResultMessage.css("display", anyOptionsMatch ? "none" : "block");

      if (searchTerm) {
        optionsContainer.addClass("option-search-active");
      } else {
        optionsContainer.removeClass("option-search-active");
      }
    });
  });

  customSelects.each(function () {
    const customSelect = $(this);
    const options = customSelect.find(".option");
    options.on("click", function () {
      $(this).toggleClass("active");
      updateSelectedOptions(customSelects);
    });
  });

  $(document).on("click", function (event) {
    const removeTag = $(event.target).closest(".remove-tag");
    if (removeTag.length) {
      const customSelect = removeTag.closest(".custom-select");
      const valueToRemove = removeTag.attr("data-value");
      const optionToRemove = customSelect.find(
        `.option[data-value="${valueToRemove}"]`
      );
      optionToRemove.removeClass("active");

      const otherSelectedOptions = customSelect.find(
        ".option.active:not(.all-tags)"
      );
      const allTagsOption = customSelect.find(".option.all-tags");
      if (otherSelectedOptions.length === 0) {
        allTagsOption.removeClass("active");
      }

      updateSelectedOptions(customSelects);
    }
  });

  const selectBoxes = $(".select-box");
  selectBoxes.on("click", function (event) {
    if (!$(event.target).closest(".tag").length) {
      $(this).parent().toggleClass("open");
    }
  });

  $(document).on("click", function (event) {
    $(".custom-select").each(function () {
      if (!$(event.target).closest(this).length) {
        $(this).removeClass("open");
      }
    });
  });

  function resetCustomSelects() {
    customSelects.each(function () {
      const customSelect = $(this);
      customSelect.find(".option.active").each(function () {
        $(this).removeClass("active");
      });
      customSelect.find(".option.all-tags").removeClass("active");
      updateSelectedOptions(customSelect);
    });
  }

  updateSelectedOptions($(customSelects[0]));

  const submitButton = $(".btn_submit");
  submitButton.on("click", function () {
    let valid = true;
    customSelects.each(function () {
      const customSelect = $(this);
      const selectedOptions = customSelect.find(".option.active");
      if (selectedOptions.length === 0) {
        const tagErrorMsg = customSelect.find(".tag_error_msg");
        tagErrorMsg.text("This is field is required.");
        tagErrorMsg.css("display", "block");
        valid = false;
      } else {
        const tagErrorMsg = customSelect.find(".tag_error_msg");
        tagErrorMsg.text("");
        tagErrorMsg.css("display", "none");
      }
    });

    if (valid) {
      let tags = $(".tags_input").val();
      alert(tags);
      resetCustomSelects();
      return;
    }
  });
});
