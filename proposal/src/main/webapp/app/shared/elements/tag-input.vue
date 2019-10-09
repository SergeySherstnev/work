<template>
    <div>
        <div class="form-control" :style="boxStyle">
            <span class="bg-primary label-primary" :style="badgeStyle" v-for="(opt,inx) in value">{{opt.name}}
                <button type="button" class="close" aria-label="Close" :style="removeStyle" @click="removeTag(inx)">
                  <i aria-hidden="true">&times;</i>
                </button>
              </span>
            <input
                type="text"
                :style="inputStyle"
                :placeholder="placeholder"
                :size="inputSize"
                v-model.trim="currentValue"
                @keydown.down="nextSearchResult"
                @keydown.space="tagFromInput(true)"
                @keydown.up="prevSearchResult"
                @keyup.enter="tagFromInput(false)"
                @keyup.esc="clearSearchResults"
                @focus="onFocus"
                @blur="onBlur"
                ref="tagsinput">
        </div>
        <div v-show="searchResults.length">
        <span class="badge-secondary" :style="badgeStyle"
              @click.prevent="clearSearchResults">Discard Search Results</span>

        <span v-for="(tag, index) in searchResults"
              :key="index"
              v-html="tag.name"
              @mouseover="searchSelection = index"
              @mousedown.prevent="getTag(tag)"
              class="selector"
              :class="{
                'selector-hovered': index == searchSelection
              }">
        </span>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import TagPropService from '@/entities/tag-prop/tag-prop.service';

    interface TagInterface {
        id: number
        name: string
    }

    export default Vue.extend({
        props: {
            value: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            existingTags: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            limit: {
                type: Number,
                default: 0
            },
            onlyExistingTags: {
                type: Boolean,
                default: false
            },
            addTagsOnBlur: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String,
                default: 'Add a tag'
            }
        },
        data() {
            return {
                currentValue: '',
                searchResults: [],
                searchSelection: 0,
                oldInput: '',
                selectedTag: -1,
            }
        },
        watch: {
            currentValue(newVal, oldVal) {
                this.searchTag();
                if (newVal.length && newVal != oldVal) {
                    if (newVal.endsWith(',')) {
                        // The comma shouldn't actually be inserted
                        this.currentValue = newVal.substring(0, newVal.length - 1);
                        // Add the inputed tag
                        this.tagFromInput(true);
                    }
                }
            }
        },
        methods: {
            addTag(tag) {
                // Check if the limit has been reached
                if (this.limit > 0 && this.value.length >= this.limit) {
                    this.$emit('limit-reached');
                    return false;
                }
                // Attach the tag if it hasn't been attached yet
                if (!this.checkTagSelected(tag)) {
                    this.value.push(tag);
                    // Emit events
                    this.$nextTick(() => {
                        this.$emit('input', this.value);
                    });
                }
                //Clear search
                this.searchResults = [];
                this.searchSelection = 0;
            },
            removeTag(inx) {
                this.value.splice(inx, 1);
            },

            tagFromInput(ignoreSearchResults = false) {
                // If we're choosing a tag from the search results
                if (this.searchResults.length && this.searchSelection >= 0 && !ignoreSearchResults) {
                    this.getTag(this.searchResults[this.searchSelection]);
                } else {
                    // If we're adding an unexisting tag
                    // If the new tag is not an empty string
                    if (!this.onlyExistingTags && this.currentValue.length) {
                        // Determine if the inputted tag exists in the existingTags
                        // array
                        let tag = this.getExistingOrNewTag(this.currentValue);
                        this.getTag(tag);
                    }
                }
            },

            searchTag() {
                if (this.oldInput != this.currentValue ) {
                    this.searchResults = [];
                    this.searchSelection = 0;
                    // Find all the existing tags which include the search text
                    const searchQuery = this.escapeRegExp(
                        this.currentValue.toLowerCase()
                    );
                    for (let tag of this.existingTags) {
                        const compareable = tag.name.toLowerCase();

                        if (compareable.search(searchQuery) > -1 && !this.checkTagSelected(tag)) {
                            this.searchResults.push(tag);
                        }
                    }
                    // Sort the search results alphabetically
                    // if (this.sortSearchResults) {
                    //     this.searchResults.sort((a, b) => {
                    //         if (a.value < b.value) return -1;
                    //         if (a.value > b.value) return 1;
                    //         return 0;
                    //     });
                    // }
                    this.oldInput = this.currentValue;
                }
            },
            getTag(tag) {
                this.clearSearchResults();
                this.addTag(tag);
                this.$nextTick(() => {
                    this.currentValue = '';
                    this.oldInput = '';
                });
            },
            getExistingOrNewTag(tagName) {
                const searchQuery = this.escapeRegExp(
                    tagName.toLowerCase()
                );
                for (let tag of this.existingTags) {
                    const compareable = tag.name.toLowerCase();
                    if (searchQuery === compareable) {
                        return tag;
                    }
                }
                let newTag = {} as TagInterface;
                newTag.id = null
                newTag.name = this.escapeRegExp(tagName)
                new TagPropService()
                    .create(newTag)
                    .then(param => {
                        newTag.id = param.id;
                    })
                    .catch(err => {
                        console.log(err);
                    });
                return newTag;
            },
            checkTagSelected(tag) {
                if (! tag || this.value.length==0) {
                    return false;
                }
                const searchQuery = this.escapeRegExp(
                    tag.name.toLowerCase()
                );
                for (let selectedTag of this.value) {
                    const compareable = selectedTag.name.toLowerCase();
                    if (selectedTag.id === tag.id && compareable.search(searchQuery) > -1) {
                        return true;
                    }
                }
                return false;
            },

            clearSearchResults() {
                this.searchResults = [];
                this.searchSelection = 0;
            },
            escapeRegExp(string) {
                return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            },

            nextSearchResult() {
                if (this.searchSelection + 1 <= this.searchResults.length - 1) {
                    this.searchSelection++;
                }
            },
            prevSearchResult() {
                if (this.searchSelection > 0) {
                    this.searchSelection--;
                }
            },
            onFocus(e) {
                this.searchTag();
            },
            onBlur(e) {
                if (this.addTagsOnBlur) {
                    // Add the inputed tag
                    this.tagFromInput(true);
                }
                this.hideTypeahead();
            },
            hideTypeahead() {
                if (! this.currentValue.length) {
                    this.$nextTick(() => {
                        this.clearSearchResults();
                    });
                }
            }
        },
        computed: {
            boxStyle() {
                return {
                    'padding': '4px 12px 0 12px',
                    'height': 'auto !important',
                };
            },
            badgeStyle() {
                return {
                    'border-radius': '5px',
                    'padding': '5px 9px',
                    'margin-bottom': '5px',
                    'margin-right': '4px',
                    'display': 'inline-block',
                    'font-size': '12px',
                    'font-weight': '700',
                    'line-height': '1',
                    'color': '#fff',
                    'vertical-align': 'middle',
                };
            },
            inputStyle() {
                return {
                    'outline': 'none',
                    'border': '0!important',
                    'color': '#495057',
                    'height': '27px',
                    'margin-top': '3px',
                };
            },
            removeStyle() {
                return {
                    'font-size': '12px',
                    'margin-left': '10px',
                    'color': 'white'
                };
            },
            inputSize() {
                if (this.currentValue != '') {
                    var reg = /[\u4e00-\u9fa5\uF900-\uFA2D]/;
                    if (reg.test(this.currentValue)) {
                        return this.currentValue.length * 2;
                    } else {
                        return this.currentValue.length;
                    }
                }
                return typeof this.placeholder == 'undefined' ? 1 : this.placeholder.length;
            }
        }
    })
</script>

<style>
    .selector {
        padding: 1px 10px;
        font-size: 12px;
        font-weight: 400;
        border-radius: 10px;
        background-color: #eee;
        color: #212121;
        display: inline-block;
        margin: 2px 5px;
    }

    .selector-hovered {
        transition: box-shadow 0.45s;
        box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    .hoverable:hover, .selector:hover {
        transition: box-shadow 0.45s;
        box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
</style>
