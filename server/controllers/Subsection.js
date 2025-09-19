const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader"); // make sure this path is correct

// Create SubSection
exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, timeDuration, description } = req.body;
    const video = req.files?.videoFile;

    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields and video file are required",
      });
    }

    // upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

    // create sub-section
    const subSectionDetails = await SubSection.create({
      title,
      timeDuration,
      description,
      videoUrl: uploadDetails.secure_url,
    });

    // update parent section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: subSectionDetails._id } },
      { new: true }
    ).populate("subSection");

    return res.status(200).json({
      success: true,
      message: "Sub Section Created Successfully",
      updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Update SubSection
exports.updateSubSection = async (req, res) => {
  try {
    const { subSectionId, title, timeDuration, description } = req.body;
    const video = req.files?.videoFile;

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({ success: false, message: "SubSection not found" });
    }

    if (title) subSection.title = title;
    if (timeDuration) subSection.timeDuration = timeDuration;
    if (description) subSection.description = description;

    if (video) {
      const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
      subSection.videoUrl = uploadDetails.secure_url;
    }

    await subSection.save();

    return res.status(200).json({
      success: true,
      message: "Sub Section Updated Successfully",
      subSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete SubSection
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;

    // delete the subsection
    const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);
    if (!deletedSubSection) {
      return res.status(404).json({ success: false, message: "SubSection not found" });
    }

    // remove reference from parent section
    await Section.findByIdAndUpdate(
      sectionId,
      { $pull: { subSection: subSectionId } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Sub Section Deleted Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
//HW : updatedSubSection;
//HW : delete SubSection;


// process.env.FOLDER_NAME = Node env var; .env se aata hai.

// (Note) Video upload kar rahe ho; function ka naam uploadImageToCloudinary hai, par chalega agar andar resource_type: "auto" ya "video" use kiya ho.