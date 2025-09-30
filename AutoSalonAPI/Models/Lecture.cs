namespace AutoSalonAPI.Models
{
    public class Lecture
    {
        public int LectureID { get; set; }
        public string LectureName { get; set; } = string.Empty;

        public int LecturerID { get; set; }          
        public Lecturer? Lecturer { get; set; }     
    }
}
