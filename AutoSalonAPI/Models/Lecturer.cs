namespace AutoSalonAPI.Models
{
    public class Lecturer
    {
        public int LecturerID { get; set; }
        public string LecturerName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        // nav
        public List<Lecture> Lectures { get; set; } = new();
    }
}
