import {
  Card, CardContent, List, ListItem, ListItemText, Chip, Stack,
  Button, Divider, Typography, Box
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import useSignHistory from '../state/signHistory';

type Props = { sx?: SxProps<Theme> };

export default function HistoryCard({ sx }: Props) {
  const { list, clear } = useSignHistory();

  return (
    <Card sx={{ height: '100%', ...sx }}>
      <Box
        sx={{
          px: 3, pt: 2.5, pb: 1.5,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          History
        </Typography>
        <Button
          onClick={clear}
          size="small"
          variant="text"
          disabled={list.length === 0}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Clear
        </Button>
      </Box>

      <Divider />

      <CardContent sx={{ pt: 2 }}>
        {list.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No messages signed yet.
          </Typography>
        ) : (
          <List dense sx={{ py: 0 }}>
            {list.map((item) => (
              <ListItem
                key={item.id}
                alignItems="flex-start"
                sx={{ borderBottom: '1px dashed', borderColor: 'divider', px: 0 }}
              >
                <ListItemText
                  primary={item.message}
                  primaryTypographyProps={{ sx: { fontWeight: 600 } }}
                  secondary={
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap' }}>
                      <Chip
                        size="small"
                        label={item.verified ? 'Verified' : 'Not verified'}
                        color={item.verified ? 'success' : 'warning'}
                      />
                      <Chip size="small" label={`${item.signature.slice(0, 18)}…`} />
                      <Chip size="small" label={new Date(item.createdAt).toLocaleString()} />
                    </Stack>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
