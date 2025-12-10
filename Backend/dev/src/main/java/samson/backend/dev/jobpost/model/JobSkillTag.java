package samson.backend.dev.jobpost.model;

public class JobSkillTag {
    private String tagId;
    private String tagNName;
    private String tagDescription;
    private String tagColor;

    public JobSkillTag(String tagId, String tagNName, String tagDescription, String tagColor) {
        this.tagId = tagId;
        this.tagNName = tagNName;
        this.tagDescription = tagDescription;
        this.tagColor = tagColor;
    }

    public String getTagId() {
        return tagId;
    }
    public void setTagId(String tagId) {
        this.tagId = tagId;
    }
    public String getTagNName() {
        return tagNName;
    }
    public void setTagNName(String tagNName) {
        this.tagNName = tagNName;
    }
    public String getTagDescription() {
        return tagDescription;
    }
    public void setTagDescription(String tagDescription) {
        this.tagDescription = tagDescription;
    }
    public String getTagColor() {
        return tagColor;
    }
    public void setTagColor(String tagColor) {
        this.tagColor = tagColor;
    }
}