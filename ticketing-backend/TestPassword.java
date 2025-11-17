import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestPassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        String password = "Test@123";
        String storedHash = "$2a$10$jNOfSB5kxnIuEMvhXD23Au3sn5KaZ3XT0nBT4R83y0Zv3jwc49vKa";
        
        System.out.println("Password: " + password);
        System.out.println("Stored hash: " + storedHash);
        System.out.println("Matches: " + encoder.matches(password, storedHash));
        
        System.out.println("\nNew hash: " + encoder.encode(password));
    }
}
