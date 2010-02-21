
	function ApplicantCache(){
		var applicantIndex = 0;
		this.saveApplicants = function(applicants, func){
			if (applicants.length > applicantIndex) {
				if (applicants[applicantIndex].isNew) {
					var applicant = applicants[applicantIndex];
					post("saveapplicant", applicant, applicant.name, "Saving Applicant", function(){
						applicantIndex++;
						this.saveApplicants(applicants, func);
					});
				}
				else {
					applicantIndex++;
					this.saveApplicants(applicants, func);
				}
			}
			else {
				applicantIndex = 0;
				func();
			}
		}
		
		
		this.editApplicants = function(applicants, func){
		
			var applicant = applicants[applicantIndex];
			if (this.edit) {
				post("editapplicant", applicant, applicant.name, "Edit Applicant", function(){
					func();
				});
			}
			else {
				applicantIndex++;
				this.editApplicants(applicants, func);
			}
			if (applicantIndex > applicants.length) {
				func();
			}
		}
	}